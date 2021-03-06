define(
    ['./lib/lodash.js'],
    function (_) {
        'use strict';
        var cart = {};

        var CartObj = function (obj) {
            this.qty = 1;
            this.getPrice = obj.getPrice.bind(obj);
            this.id = obj.id;
            this.name = obj.name;
            this.itemSrc = obj;
        };

        function addToCart(item) {
            var success = true;
            if (!cart[item.id]) {
                cart[item.id] = new CartObj(item);
            } else if (cart[item.id].qty === item.limit) {
                success = false;
            } else {
                cart[item.id].qty++;
            }
            return {
                success: success,
                qty: cart[item.id].qty
            };
        }

        function removeFromCart(item) {
            var success = true;
            if (!cart[item.id]) {
                success = false;
            } else if (cart[item.id].qty === 0) {
                delete cart[item.id];
            } else {
                cart[item.id].qty--;
            }
            return {
                success: success,
                qty: cart[item.id] ? cart[item.id].qty : 0
            };
        }

        function getTotal() {
            var total = _.reduce(cart, function (acc, value, key) {
                return acc + cart[key].qty * cart[key].itemSrc.getPrice();
            }, 0);
            return total.toFixed(2);
        }

        function getCartItem(id) {
            for (var key in cart) {
                if (cart[key].id === id) {
                    return cart[key];

                }
            }

        }

        function getIterator() {
            var cartItemsArray = _.values(cart);
            var i = 0;


            function hasNext() {
                return i < cartItemsArray.length;
            }

            function next() {
                return cartItemsArray[i++];
            }

            return {
                hasNext: hasNext,
                next: next
            };
        }

        function isEmpty() {
            return Object.getOwnPropertyNames(cart).length === 0;
        }

        return {
            addToCart: addToCart,
            removeFromCart: removeFromCart,
            getTotal: getTotal,
            getItemInChart: getCartItem,
            getIterator: getIterator,
            isEmpty: isEmpty,
            cart: cart

        };
    }
);