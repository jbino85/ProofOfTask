# Agent Instructions

# MirrorWitness 2025-11-04

## Build & Test Commands

### Move Contract

```bash
cd move
sui move build
sui client publish --gas-budget 100000000
```

### Python Services

```bash
cd python
pip install -r requirements.txt

# Test miner
python miner.py

# Test witnesses
python witness1.py  # Terminal 1
python witness2.py  # Terminal 2
python witness3.py  # Terminal 3
```

### React UI

```bash
cd ui
npm install
npm run dev       # Development
npm run build     # Production
```

### Full Stack

```bash
# From project root
./run.sh                    # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop all services
```

## Project Structure

- `move/` - Sui Move smart contract
- `python/` - Miner and witness nodes
- `ui/` - React frontend with @mysten/dapp-kit
- `docker-compose.yml` - Full stack orchestration

## Code Style

- **Move**: Follow Sui Move style guide
- **Python**: PEP 8, type hints preferred
- **JavaScript**: ES6+, functional components, Tailwind CSS

## Testing

Currently no automated tests. Manual testing:

1. Start all services with `./run.sh`
2. Open http://localhost:3000
3. Connect wallet
4. Start task and verify 3 witnesses respond
5. Check logs for errors

## Security Notes

See [SECURITY.md](./SECURITY.md) for known vulnerabilities.

**DO NOT** deploy to production without addressing security issues.
