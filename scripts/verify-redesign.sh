#!/bin/bash
cd /home/z/my-project
pkill -f "next dev" 2>/dev/null; sleep 1
./node_modules/.bin/next dev -p 3000 > dev.log 2>&1 &
SERVER_PID=$!
echo "=== server PID $SERVER_PID ==="
for i in $(seq 1 25); do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/" 2>/dev/null)
  if [ "$code" = "200" ]; then echo "server ready"; break; fi
  sleep 1
done

getref() { agent-browser snapshot -i 2>&1 | grep -F "$1" | grep -oP '\[ref=e\K[0-9]+' | head -1; }

echo "=== 1. HOME (redesigned editorial) ==="
agent-browser storage local clear 2>&1 | tail -1
agent-browser open "http://localhost:3000/" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-01-home.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "Considered goods|Shop the edit|Shop by category|Featured|Best sellers|Newsletter" | head -8

echo "=== 2. SHOP ==="
agent-browser open "http://localhost:3000/?view=shop" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-02-shop.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "All Products|Quick add|Categories|Price" | head -6

echo "=== 3. PRODUCT DETAIL ==="
agent-browser open "http://localhost:3000/?view=product&id=classic-denim-jacket" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-03-product.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "Classic Denim|Add to Cart|Buy Now|Product Details|You may also like" | head -6

echo "=== 4. CART (add then view) ==="
ADDREF=$(agent-browser snapshot -i 2>&1 | grep -oP 'button "Add to Cart" \[ref=e\K[0-9]+' | head -1)
agent-browser click @e$ADDREF 2>&1 | tail -1
sleep 2
agent-browser open "http://localhost:3000/?view=cart" 2>&1 | tail -1
sleep 2
agent-browser screenshot /home/z/my-project/shot-04-cart.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "Shopping Cart|Order Summary|Proceed|Subtotal" | head -5

echo "=== 5. LOGIN ==="
agent-browser open "http://localhost:3000/?view=login" 2>&1 | tail -1
sleep 2
agent-browser screenshot /home/z/my-project/shot-05-login.png --full 2>&1 | tail -1

echo "=== 6. ADMIN LOGIN + DASHBOARD ==="
agent-browser storage local clear 2>&1 | tail -1
agent-browser open "http://localhost:3000/?view=login" 2>&1 | tail -1
sleep 2
ADMIN_BTN=$(getref 'button "Admin"')
agent-browser click @e$ADMIN_BTN 2>&1 | tail -1
sleep 1
SIGN_BTN=$(getref 'button "Sign In"')
agent-browser click @e$SIGN_BTN 2>&1 | tail -1
sleep 3
agent-browser open "http://localhost:3000/?view=admin&section=dashboard" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-06-admin-dashboard.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "Dashboard|Revenue|Total|Customers|Manage" | head -8

echo "=== 7. ADMIN PRODUCTS ==="
agent-browser open "http://localhost:3000/?view=admin&section=products" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-07-admin-products.png --full 2>&1 | tail -1

echo "=== 8. ADMIN ORDERS ==="
agent-browser open "http://localhost:3000/?view=admin&section=orders" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-08-admin-orders.png --full 2>&1 | tail -1

echo "=== 9. ADMIN CUSTOMERS ==="
agent-browser open "http://localhost:3000/?view=admin&section=customers" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-09-admin-customers.png --full 2>&1 | tail -1

echo "=== 10. ADMIN CATEGORIES ==="
agent-browser open "http://localhost:3000/?view=admin&section=categories" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-10-admin-categories.png --full 2>&1 | tail -1

echo "========================================"
echo "VERIFICATION COMPLETE"
echo "========================================"
echo "=== errors in dev.log ==="
grep -iE "⨯|TypeError|Cannot read|Module not found" dev.log | tail -10 || echo "no errors"
kill $SERVER_PID 2>/dev/null
echo "server stopped"
