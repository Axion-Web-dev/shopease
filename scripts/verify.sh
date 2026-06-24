#!/bin/bash
# Comprehensive end-to-end verification script
cd /home/z/my-project

pkill -f "next dev" 2>/dev/null; sleep 1

# Start server
./node_modules/.bin/next dev -p 3000 > dev.log 2>&1 &
SERVER_PID=$!
echo "=== server PID $SERVER_PID ==="

# Wait for ready
for i in $(seq 1 25); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/" 2>/dev/null)
  if [ "$code" = "200" ]; then echo "server ready"; break; fi
  sleep 1
done

run() { echo "--- $1 ---"; agent-browser $2 2>&1 | tail -n 20; }

echo "========================================"
echo "1. HOME PAGE"
echo "========================================"
agent-browser open "http://localhost:3000/" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-01-home.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|button.*Shop Now|button.*Sign in" | head -8

echo "========================================"
echo "2. SHOP PAGE (filter by Fashion)"
echo "========================================"
agent-browser open "http://localhost:3000/?view=shop&category=fashion" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-02-shop.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|All Products|Fashion" | head -10

echo "========================================"
echo "3. PRODUCT DETAIL"
echo "========================================"
agent-browser open "http://localhost:3000/?view=product&id=classic-denim-jacket" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-03-product.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|Add to Cart|Buy Now|In stock" | head -10

echo "========================================"
echo "4. ADD TO CART + CART PAGE"
echo "========================================"
# find Add to Cart button ref
ADDREF=$(agent-browser snapshot -i 2>&1 | grep -oP 'button "Add to Cart" \[ref=e\K[0-9]+' | head -1)
echo "Add to cart ref: @e$ADDREF"
agent-browser click @e$ADDREF 2>&1 | tail -1
sleep 2
agent-browser open "http://localhost:3000/?view=cart" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-04-cart.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|Order Summary|Proceed|Subtotal" | head -8

echo "========================================"
echo "5. LOGIN AS ADMIN"
echo "========================================"
agent-browser open "http://localhost:3000/?view=login" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-05-login.png --full 2>&1 | tail -1
# fill admin credentials
EMAILREF=$(agent-browser snapshot -i 2>&1 | grep -oP 'textbox.*Email.*\[ref=e\K[0-9]+' | head -1)
PASSREF=$(agent-browser snapshot -i 2>&1 | grep -oP 'textbox.*Password.*\[ref=e\K[0-9]+' | head -1)
echo "email ref: @e$EMAILREF, pass ref: @e$PASSREF"
agent-browser fill @e$EMAILREF "admin@shopease.com" 2>&1 | tail -1
agent-browser fill @e$PASSREF "admin123" 2>&1 | tail -1
# find Sign In button
SIGNREF=$(agent-browser snapshot -i 2>&1 | grep -oP 'button "Sign In" \[ref=e\K[0-9]+' | head -1)
agent-browser click @e$SIGNREF 2>&1 | tail -1
sleep 3
agent-browser snapshot -i 2>&1 | grep -E "heading|Admin|Dashboard|Sign out" | head -8

echo "========================================"
echo "6. ADMIN DASHBOARD"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=dashboard" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-06-admin-dashboard.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|Revenue|Orders|Products|Customers" | head -10

echo "========================================"
echo "7. ADMIN PRODUCTS"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=products" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-07-admin-products.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|Add Product|Edit|Delete" | head -8

echo "========================================"
echo "8. ADMIN ORDERS"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=orders" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-08-admin-orders.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -E "heading|View|Pending|Completed|SE-" | head -8

echo "========================================"
echo "VERIFICATION COMPLETE"
echo "========================================"
# check dev log for errors
echo "=== errors in dev.log ==="
grep -iE "error|⨯|failed|cannot" dev.log | grep -v "node_modules" | tail -10 || echo "no errors"

kill $SERVER_PID 2>/dev/null
echo "server stopped"
