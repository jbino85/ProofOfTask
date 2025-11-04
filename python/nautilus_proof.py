#!/usr/bin/env python3
# MirrorWitness PHASE2 2025-11-04

import hashlib
import json
from typing import List, Dict

class NautilusProofAltitude:
    """
    Nautilus ZK-PROOF: Altitude Verification
    
    Input: GPS array
    Output: "altitude never > 120 m" ✓
    
    In production, this would use actual Nautilus zk-SNARK library
    For Phase 2, we implement the logic and simulate the proof generation
    """
    
    MAX_ALTITUDE = 120.0  # meters
    
    def __init__(self):
        self.proof_circuit = "altitude_check_v1"
        
    def generate_proof(self, gps_points: List[Dict]) -> Dict:
        """
        Generate ZK proof that all GPS points are below max altitude
        
        Args:
            gps_points: List of {"lat": float, "lon": float, "alt": float, "timestamp": float}
            
        Returns:
            Proof dict with verification status
        """
        if not gps_points:
            return {"valid": False, "error": "No GPS data"}
        
        # Extract altitudes
        altitudes = [p.get('alt', 0) for p in gps_points]
        max_alt = max(altitudes)
        min_alt = min(altitudes)
        avg_alt = sum(altitudes) / len(altitudes)
        
        # Check constraint
        constraint_satisfied = max_alt <= self.MAX_ALTITUDE
        
        # Generate proof hash (in production, this would be actual zk-SNARK)
        proof_data = {
            "circuit": self.proof_circuit,
            "public_inputs": {
                "max_altitude_limit": self.MAX_ALTITUDE,
                "num_points": len(gps_points)
            },
            "private_inputs_hash": self._hash_private_inputs(gps_points),
            "constraint_satisfied": constraint_satisfied
        }
        
        proof_hash = hashlib.sha256(json.dumps(proof_data, sort_keys=True).encode()).hexdigest()
        
        return {
            "valid": constraint_satisfied,
            "proof_hash": f"0x{proof_hash[:16]}...",
            "max_altitude": round(max_alt, 2),
            "min_altitude": round(min_alt, 2),
            "avg_altitude": round(avg_alt, 2),
            "num_points": len(gps_points),
            "constraint": f"altitude ≤ {self.MAX_ALTITUDE}m",
            "verification": "✓ VERIFIED" if constraint_satisfied else "✗ FAILED",
            "circuit": self.proof_circuit
        }
    
    def _hash_private_inputs(self, gps_points: List[Dict]) -> str:
        """Hash private GPS data (actual coordinates hidden in ZK)"""
        data = json.dumps(gps_points, sort_keys=True).encode()
        return hashlib.sha256(data).hexdigest()[:16]
    
    def verify_proof(self, proof: Dict) -> bool:
        """Verify the ZK proof (on-chain verification)"""
        return proof.get('valid', False)
    
    def format_proof_for_chain(self, proof: Dict) -> str:
        """Format proof for Sui Move contract submission"""
        return json.dumps({
            "proof_hash": proof['proof_hash'],
            "max_altitude": proof['max_altitude'],
            "verified": proof['valid']
        })

def test_proof():
    """Test the Nautilus proof system"""
    print("=== Nautilus ZK-PROOF Test ===\n")
    
    # Test case 1: Valid altitudes
    gps_data_valid = [
        {"lat": 37.7749, "lon": -122.4194, "alt": 95.3, "timestamp": 1234567890},
        {"lat": 37.7750, "lon": -122.4195, "alt": 102.1, "timestamp": 1234567891},
        {"lat": 37.7751, "lon": -122.4196, "alt": 117.8, "timestamp": 1234567892},
        {"lat": 37.7752, "lon": -122.4197, "alt": 110.5, "timestamp": 1234567893},
    ]
    
    prover = NautilusProofAltitude()
    proof = prover.generate_proof(gps_data_valid)
    
    print("Test 1: Valid Altitudes")
    print(f"  Max altitude: {proof['max_altitude']}m")
    print(f"  Constraint: {proof['constraint']}")
    print(f"  Result: {proof['verification']}")
    print(f"  Proof hash: {proof['proof_hash']}")
    print()
    
    # Test case 2: Invalid altitudes (too high)
    gps_data_invalid = [
        {"lat": 37.7749, "lon": -122.4194, "alt": 95.3, "timestamp": 1234567890},
        {"lat": 37.7750, "lon": -122.4195, "alt": 125.7, "timestamp": 1234567891},  # Too high!
        {"lat": 37.7751, "lon": -122.4196, "alt": 118.2, "timestamp": 1234567892},
    ]
    
    proof_invalid = prover.generate_proof(gps_data_invalid)
    
    print("Test 2: Invalid Altitudes")
    print(f"  Max altitude: {proof_invalid['max_altitude']}m")
    print(f"  Constraint: {proof_invalid['constraint']}")
    print(f"  Result: {proof_invalid['verification']}")
    print(f"  Proof hash: {proof_invalid['proof_hash']}")
    print()
    
    # Chain format
    chain_proof = prover.format_proof_for_chain(proof)
    print("On-chain proof format:")
    print(f"  {chain_proof}")

if __name__ == "__main__":
    test_proof()
