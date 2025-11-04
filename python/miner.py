#!/usr/bin/env python3
# MirrorWitness 2025-11-04

import asyncio
import json
import time
import hashlib
import hmac
import random
import os
from datetime import datetime, timedelta
import websockets
import aiohttp

# Configuration
WS_PORT = 8765
HMAC_SECRET = os.getenv("HMAC_SECRET", "proof-of-task-secret-2025")
SEAL_DURATION = 300  # 5 minutes
WALRUS_API = os.getenv("WALRUS_API", "http://localhost:9000")
SUI_RPC = os.getenv("SUI_RPC", "http://localhost:9000")

class DroneSimulator:
    def __init__(self):
        self.lat = 37.7749  # San Francisco
        self.lon = -122.4194
        self.alt = 100.0
        self.speed = 0.0001  # degrees per second
        
    def update(self):
        """Simulate drone movement"""
        angle = random.uniform(0, 2 * 3.14159)
        self.lat += self.speed * random.uniform(0.5, 1.5) * (1 if random.random() > 0.5 else -1)
        self.lon += self.speed * random.uniform(0.5, 1.5) * (1 if random.random() > 0.5 else -1)
        self.alt += random.uniform(-1, 1)
        
        return {
            "timestamp": time.time(),
            "lat": round(self.lat, 6),
            "lon": round(self.lon, 6),
            "alt": round(self.alt, 2),
            "type": "gps_data"
        }

class TaskMiner:
    def __init__(self):
        self.drone = DroneSimulator()
        self.current_task_id = None
        
    def create_hmac(self, data):
        """Create HMAC for message authentication"""
        message = json.dumps(data).encode()
        return hmac.new(HMAC_SECRET.encode(), message, hashlib.sha256).hexdigest()
    
    async def upload_to_walrus(self, data):
        """Upload sealed data to Walrus (simulated)"""
        # In production, this would interact with actual Walrus
        # For MVP, we simulate with a hash-based CID
        payload = json.dumps(data).encode()
        cid = hashlib.sha256(payload).hexdigest()[:32]
        return cid, payload
    
    async def submit_sui_transaction(self, cid):
        """Submit commit_blob_cid transaction to Sui"""
        # In production, this would use sui-sdk
        # For MVP, we simulate the transaction
        print(f"[MINER] Submitting Sui TX: commit_blob_cid(cid={cid[:16]}...)")
        return True
    
    async def broadcast_to_witnesses(self, payload, cid):
        """Broadcast task to witnesses via WebSocket"""
        message = {
            "type": "new_task",
            "payload": payload.hex(),
            "cid": cid,
            "timestamp": time.time()
        }
        message["hmac"] = self.create_hmac(message)
        
        # Broadcast to all connected witnesses
        connections = []
        for port in [8766, 8767, 8768]:  # 3 witness ports
            try:
                async with websockets.connect(f"ws://localhost:{port}") as ws:
                    await ws.send(json.dumps(message))
                    print(f"[MINER] Broadcasted to witness on port {port}")
            except Exception as e:
                print(f"[MINER] Failed to connect to witness {port}: {e}")
    
    async def mine_loop(self):
        """Main mining loop"""
        print("[MINER] Starting Proof-of-Task miner...")
        
        while True:
            try:
                # Generate GPS data
                gps_data = self.drone.update()
                print(f"[MINER] GPS: lat={gps_data['lat']}, lon={gps_data['lon']}, alt={gps_data['alt']}m")
                
                # Seal data with 5-minute validity
                sealed_data = {
                    **gps_data,
                    "sealed_until": time.time() + SEAL_DURATION,
                    "nonce": random.randint(1000000, 9999999)
                }
                
                # Upload to Walrus
                cid, payload = await self.upload_to_walrus(sealed_data)
                print(f"[MINER] Uploaded to Walrus: CID={cid[:16]}...")
                
                # Submit Sui transaction
                await self.submit_sui_transaction(cid)
                
                # Broadcast to witnesses
                await self.broadcast_to_witnesses(payload, cid)
                
                # Wait 1 second before next GPS update
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"[MINER] Error in mining loop: {e}")
                await asyncio.sleep(1)

if __name__ == "__main__":
    miner = TaskMiner()
    asyncio.run(miner.mine_loop())
