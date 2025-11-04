# Security Considerations

# MirrorWitness 2025-11-04

## ⚠️ Current MVP Security Status

**This MVP is NOT production-ready.** It is a proof-of-concept demonstrating the core mechanics of Proof-of-Task. The following security issues exist:

---

## Known Vulnerabilities in MVP

### 1. Localhost Witnesses (Critical)

**Issue**: All 3 witnesses run on the same machine, controlled by the same operator.

**Attack**: A malicious operator can sign any fake task and mint TASK tokens at will.

**Production Fix**: 
- Distributed witness network across independent operators
- Geographic distribution requirements
- Stake-based witness selection with slashing

### 2. No Sybil Resistance

**Issue**: Nothing prevents one entity from running all witnesses.

**Attack**: Attacker creates 3 witnesses, colludes to verify fake tasks.

**Production Fix**:
- Proof-of-stake witness registration
- Reputation system
- Minimum stake requirements
- Time-locked stake withdrawals

### 3. Simulated GPS Data

**Issue**: GPS data is randomly generated, not from real hardware.

**Attack**: Any GPS coordinates can be claimed without verification.

**Production Fix**:
- Hardware GPS module integration
- Signed GPS data from trusted modules (u-blox, etc.)
- Cross-validation between multiple witnesses
- Geofencing and anomaly detection

### 4. No Privacy Protection

**Issue**: All task data and GPS coordinates are public on-chain.

**Attack**: Location tracking, surveillance, doxxing.

**Production Fix**:
- Nautilus ZK proofs for location verification without revealing exact coordinates
- Encrypted payloads with threshold decryption
- Commitment schemes with delayed reveal

### 5. HMAC Secret Hardcoded

**Issue**: `HMAC_SECRET` is the same for all participants and visible in code.

**Attack**: Anyone can spoof witness messages.

**Production Fix**:
- Per-session ECDH key exchange
- TLS/DTLS for all communications
- Attestation-based authentication

### 6. No Replay Protection

**Issue**: Witness signatures could potentially be reused across tasks.

**Attack**: Replay old signatures to verify new fake tasks.

**Production Fix**:
- Include task ID and timestamp in signed message
- Nonce-based replay prevention
- Short signature validity windows

### 7. Walrus Integration Simulated

**Issue**: No actual blob storage, just fake CIDs.

**Attack**: Claim any CID without uploading data.

**Production Fix**:
- Real Walrus blob storage integration
- Verify CID matches uploaded data
- Witness verification of blob availability

### 8. No Economic Security

**Issue**: 10 TASK always minted, regardless of task value or network conditions.

**Attack**: Spam cheap/fake tasks to drain treasury.

**Production Fix**:
- Dynamic rewards based on task difficulty
- Staking requirements for task creation
- Fee market for priority
- Treasury caps and inflation controls

### 9. No Witness Selection

**Issue**: Any 3 witnesses can verify any task.

**Attack**: Task creator chooses colluding witnesses.

**Production Fix**:
- VRF-based random witness selection
- Minimum distance between witnesses
- Stake-weighted selection with rotation

### 10. 5-Minute Expiry Too Long

**Issue**: Tasks expire after 5 minutes, allowing slow attacks.

**Attack**: Pre-compute signatures, coordinate attacks leisurely.

**Production Fix**:
- Shorter expiry (30-60 seconds)
- Real-time coordination requirements
- Network latency monitoring

---

## Smart Contract Security

### Audited (✅) vs Not Audited (❌)

- ❌ No formal audit performed
- ❌ No fuzzing or property testing
- ❌ No economic model validation
- ✅ Basic Ed25519 verification (using Sui framework)
- ✅ Hash verification (SHA3-256)
- ❌ No reentrancy protection testing
- ❌ No overflow protection testing (Move handles this, but not verified)

### Known Contract Limitations

1. **No Witness Slashing**: Malicious witnesses can sign anything without penalty
2. **No Task Cancellation**: Once staked, task cannot be cancelled
3. **No Partial Rewards**: Either 3 witnesses or nothing
4. **No Witness Registration**: Any Ed25519 key can witness
5. **No Treasury Governance**: Fixed 10 TASK reward

---

## Recommended Production Security Measures

### Cryptographic

- [ ] Implement Nautilus ZK-SNARKs for location privacy
- [ ] BLS signature aggregation for efficiency
- [ ] Threshold signatures for witness coordination
- [ ] Verifiable Random Function (VRF) for witness selection

### Network

- [ ] TLS 1.3 for all communications
- [ ] Certificate pinning for witness nodes
- [ ] DDoS protection and rate limiting
- [ ] Tor/I2P support for anonymity (optional)

### Smart Contract

- [ ] Formal verification with Move Prover
- [ ] Third-party security audit (Zellic, OtterSec, etc.)
- [ ] Bug bounty program
- [ ] Time-locked upgrades with governance

### Economic

- [ ] Bonding curves for TASK supply
- [ ] Slashing conditions and penalties
- [ ] Insurance fund for failures
- [ ] Fee burning mechanism

### Hardware

- [ ] Secure element for key storage (SE050, etc.)
- [ ] Trusted Execution Environment (TEE)
- [ ] Hardware attestation (TPM, etc.)
- [ ] Tamper detection

---

## Responsible Disclosure

If you find a security vulnerability in this MVP (beyond the known issues above), please:

1. **Do NOT** open a public issue
2. Email: security@yourproject.com (placeholder)
3. Include: reproduction steps, impact assessment, suggested fix
4. Allow 90 days for response before public disclosure

---

## Disclaimer

**USE AT YOUR OWN RISK.** This software is provided "as is" without warranty. The authors are not responsible for any loss of funds, data breaches, or other damages.

For production deployment, conduct a full security audit and implement all recommended measures above.
