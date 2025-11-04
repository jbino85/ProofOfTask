#!/usr/bin/env python3
# MirrorWitness PHASE2 2025-11-04

import asyncio
import json
import time

class VirtualLoRa:
    """
    Virtual LoRa SX1262 radio simulator (915 MHz)
    Zero hardware needed - broadcasts same payload on software channel
    """
    
    def __init__(self, freq_mhz=915.0, power_dbm=20, bandwidth_khz=125):
        self.frequency = freq_mhz
        self.power = power_dbm
        self.bandwidth = bandwidth_khz
        self.range_km = 4.8  # Simulated range
        self.channel = f"lora_{int(freq_mhz)}"
        
        print(f"[LoRa] Virtual SX1262 initialized")
        print(f"[LoRa] Frequency: {freq_mhz} MHz")
        print(f"[LoRa] Power: {power_dbm} dBm")
        print(f"[LoRa] Range: {self.range_km} km (simulated)")
        print(f"[LoRa] Bandwidth: {bandwidth_khz} kHz")
    
    def calculate_signal_strength(self, distance_km):
        """Calculate dBm based on distance (free space path loss)"""
        if distance_km == 0:
            return self.power
        
        # Simplified FSPL formula
        fspl = 32.45 + 20 * (distance_km) + 20 * (self.frequency / 1000)
        received_power = self.power - fspl
        return round(received_power, 1)
    
    def broadcast(self, payload, distance_km=0.5):
        """
        Broadcast payload on virtual LoRa channel
        In production, this would use real SX1262 radio
        """
        signal_dbm = self.calculate_signal_strength(distance_km)
        
        packet = {
            "channel": self.channel,
            "frequency_mhz": self.frequency,
            "payload": payload.hex() if isinstance(payload, bytes) else payload,
            "rssi_dbm": signal_dbm,
            "snr_db": 10.5,  # Simulated SNR
            "timestamp": time.time(),
            "spreading_factor": 7,
            "coding_rate": "4/5"
        }
        
        print(f"[LoRa] TX → {self.frequency} MHz | RSSI: {signal_dbm} dBm | Range: {distance_km} km")
        return packet
    
    def receive(self, packet):
        """
        Receive packet from virtual LoRa channel
        Simulates reception with RSSI and SNR
        """
        if packet.get('channel') != self.channel:
            return None
        
        rssi = packet.get('rssi_dbm', -100)
        if rssi < -120:  # Below sensitivity
            print(f"[LoRa] RX FAIL → Signal too weak: {rssi} dBm")
            return None
        
        print(f"[LoRa] RX ← {packet['frequency_mhz']} MHz | RSSI: {rssi} dBm")
        return packet

async def lora_beacon_loop():
    """
    Continuously broadcast LoRa beacon
    Simulates ESP32-SX1262 hardware behavior
    """
    lora = VirtualLoRa(freq_mhz=915.0, power_dbm=20)
    
    print("[LoRa] Beacon mode active")
    print("[LoRa] Broadcasting witness availability...")
    
    while True:
        beacon = {
            "type": "witness_beacon",
            "witness_id": "virtual_001",
            "timestamp": time.time(),
            "status": "ready"
        }
        
        payload = json.dumps(beacon).encode()
        packet = lora.broadcast(payload, distance_km=2.3)
        
        await asyncio.sleep(10)  # Beacon every 10 seconds

if __name__ == "__main__":
    print("=== Virtual LoRa SX1262 Simulator ===")
    print("NO HARDWARE NEEDED — Software-only 915 MHz channel")
    print("")
    
    asyncio.run(lora_beacon_loop())
