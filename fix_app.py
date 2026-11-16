"""
Fix App.jsx syntax errors:
1. Remove orphaned/stray duplicate code at lines 1437-1454 (0-indexed: 1436-1453)
2. Fix any stray closing at the very end
"""

with open('src/App.jsx', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines before fix: {len(lines)}")

# Print lines 1434-1455 to confirm (0-indexed: 1433-1454)
print("\n--- Lines 1433-1454 (1-indexed 1434-1455) ---")
for i in range(1433, min(1455, len(lines))):
    print(f"  {i+1}: {repr(lines[i][:100])}")

# Remove the orphaned block: lines 1437-1454 (0-indexed: 1436-1453)
# That is: lines[1436] through lines[1453] inclusive = 18 lines to delete
del lines[1436:1454]

print(f"\nTotal lines after fix: {len(lines)}")

# Print the area around the fix
print("\n--- Lines after fix (1430-1460) ---")
for i in range(1429, min(1460, len(lines))):
    print(f"  {i+1}: {repr(lines[i][:100])}")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\nDone! App.jsx fixed.")

