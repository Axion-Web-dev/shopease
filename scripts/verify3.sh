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

# Helper: extract a ref by matching a text pattern in snapshot
getref() {
  agent-browser snapshot -i 2>&1 | grep -F "$1" | grep -oP '\[ref=e\K[0-9]+' | head -1
}

echo "========================================"
echo "5. LOGIN AS ADMIN (via demo Admin button)"
echo "========================================"
agent-browser storage local clear 2>&1 | tail -1
agent-browser open "http://localhost:3000/?view=login" 2>&1 | tail -1
sleep 3
agent-browser screenshot /home/z/my-project/shot-05-login.png --full 2>&1 | tail -1
# Click the "Admin" demo button to autofill credentials
ADMIN_BTN=$(getref 'button "Admin"')
echo "Admin button ref: @e$ADMIN_BTN"
agent-browser click @e$ADMIN_BTN 2>&1 | tail -1
sleep 1
# Now click Sign In
SIGN_BTN=$(getref 'button "Sign In"')
echo "Sign In button ref: @e$SIGN_BTN"
agent-browser click @e$SIGN_BTN 2>&1 | tail -1
sleep 4
echo "--- after login ---"
agent-browser snapshot -i 2>&1 | grep -iE "heading|Admin|Dashboard|Sign out|account|orders|avatar" | head -10
agent-browser screenshot /home/z/my-project/shot-05b-after-login.png --full 2>&1 | tail -1

echo "========================================"
echo "6. ADMIN DASHBOARD"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=dashboard" 2>&1 | tail -1
sleep 5
agent-browser screenshot /home/z/my-project/shot-06-admin-dashboard.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "heading|Revenue|Total|Customers|Dashboard|Manage|pending|low-stock" | head -12

echo "========================================"
echo "7. ADMIN PRODUCTS"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=products" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-07-admin-products.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "heading|Add Product|Denim|Headphones|Backpack" | head -10

echo "========================================"
echo "8. ADMIN ORDERS"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=orders" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-08-admin-orders.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "heading|SE-|View|Pending|Completed|Processing|Shipped" | head -10

echo "========================================"
echo "9. ADMIN CUSTOMERS"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=customers" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-09-admin-customers.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "heading|Jamie|customer|Orders|Spent|View" | head -10

echo "========================================"
echo "10. ADMIN CATEGORIES"
echo "========================================"
agent-browser open "http://localhost:3000/?view=admin&section=categories" 2>&1 | tail -1
sleep 4
agent-browser screenshot /home/z/my-project/shot-10-admin-categories.png --full 2>&1 | tail -1
agent-browser snapshot -i 2>&1 | grep -iE "heading|Fashion|Electronics|Accessories|Home|Add Category" | head -10

echo "========================================"
echo "VERIFICATION COMPLETE"
echo "========================================"
echo "=== errors in dev.log ==="
grep -iE "⨯|TypeError|Cannot read|Module not found" dev.log | tail -10 || echo "no errors"
kill $SERVER_PID 2>/dev/null
echo "server stopped"
