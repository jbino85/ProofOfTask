#!/usr/bin/env python3
# MirrorWitness 2025-11-04

import asyncio
import json
import hashlib
import hmac
import os
from pathlib import Path
from nacl.signing import SigningKey
from nacl.encoding import HexEncoder
import websockets

WITNESS_ID = 3
WS_PORT = 8768
HMAC_SECRET = os.getenv("HMAC_SECRET", "proof-of-task-secret-2025")
KEY_PATH = Path.home() / ".pot" / f"witness_{WITNESS_ID}.key"
GPS_OFFSET = 0.001  # km offset for simulation

class WitnessNode:
    def __init__(self):
        self.signing_key = self.load_or_create_key()
        self.verify_key = self.signing_key.verify_key
        print(f"[WITNESS-{WITNESS_ID}] Pubkey: {self.verify_key.encode(encoder=HexEncoder).decode()[:32]}...")
        
    def load_or_create_key(self):
        """Load existing Ed25519 key or create new one"""
        KEY_PATH.parent.mkdir(parents=True, exist_ok=True)
        
        if KEY_PATH.exists():
            with open(KEY_PATH, 'rb') as f:
                return SigningKey(f.read())
        else:
            key = SigningKey.generate()
            with open(KEY_PATH, 'wb') as f:
                f.write(key.encode())
            print(f"[WITNESS-{WITNESS_ID}] Generated new keypair: {KEY_PATH}")
            return key
    
    def verify_hmac(self, message, received_hmac):
        """Verify HMAC of received message"""
        message_copy = message.copy()
        message_copy.pop('hmac', None)
        expected = hmac.new(
            HMAC_SECRET.encode(),
            json.dumps(message_copy).encode(),
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, received_hmac)
    
    def add_gps_noise(self, data):
        """Add fake GPS offset to simulate different witness location"""
        if 'lat' in data:
            data['lat'] += GPS_OFFSET * WITNESS_ID
        if 'lon' in data:
            data['lon'] += GPS_OFFSET * WITNESS_ID
        return data
    
    async def process_task(self, message):
        """Verify and sign task payload"""
        # Verify HMAC
        if not self.verify_hmac(message, message.get('hmac', '')):
            print(f"[WITNESS-{WITNESS_ID}] HMAC verification failed!")
            return None
        
        # Decode payload
        try:
            payload = bytes.fromhex(message['payload'])
            data = json.loads(payload)
        except Exception as e:
            print(f"[WITNESS-{WITNESS_ID}] Failed to decode payload: {e}")
            return None
        
        # Add GPS noise (simulate different witness location)
        data = self.add_gps_noise(data)
        
        # Re-hash payload
        payload_hash = hashlib.sha256(payload).hexdigest()
        print(f"[WITNESS-{WITNESS_ID}] Payload hash: {payload_hash[:16]}...")
        
        # Sign payload
        signature = self.signing_key.sign(payload)
        
        # Prepare response
        response = {
            "type": "witness_signature",
            "witness_id": WITNESS_ID,
            "pubkey": self.verify_key.encode(encoder=HexEncoder).decode(),
            "signature": signature.signature.hex(),
            "payload_hash": payload_hash,
            "cid": message['cid']
        }
        
        print(f"[WITNESS-{WITNESS_ID}] Signed task {message['cid'][:16]}...")
        return response
    
    async def handle_connection(self, websocket):
        """Handle WebSocket connection from miner"""
        print(f"[WITNESS-{WITNESS_ID}] New connection from {websocket.remote_address}")
        
        async for message in websocket:
            try:
                data = json.loads(message)
                
                if data.get('type') == 'new_task':
                    response = await self.process_task(data)
                    if response:
                        await websocket.send(json.dumps(response))
                        print(f"[WITNESS-{WITNESS_ID}] Sent signature response")
                        
            except Exception as e:
                print(f"[WITNESS-{WITNESS_ID}] Error processing message: {e}")
    
    async def start_server(self):
        """Start WebSocket server"""
        print(f"[WITNESS-{WITNESS_ID}] Starting server on port {WS_PORT}")
        async with websockets.serve(self.handle_connection, "0.0.0.0", WS_PORT):
            await asyncio.Future()  # Run forever

if __name__ == "__main__":
    witness = WitnessNode()
    asyncio.run(witness.start_server())
