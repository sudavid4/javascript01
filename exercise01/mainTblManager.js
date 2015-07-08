doresh('mainTblManager.js',
    [
        'cart.js',
        'functionalElements.js',
        './dom/mainTbl.js',
        'tblUtils.js',
        'itemTypes.js',
        'utils.js'
    ],
    function (cart, functional, domMainTblHelper, tblUtils, itemTypes, utils) {
        var headers = ['id', 'name', 'desc', 'price', 'cart'];
        var headersRow = tblUtils.createHeadersRow(headers);

        var composed = {
            resetTotal: functional.fcompose(
                domMainTblHelper.resetTotal,
                cart.getTotal
            )
        };

        var cartEvent = {
            minus: function (obj){
                return function(){
                    var returnval = cart.removeFromCart(obj).qty.toString();
                    composed.resetTotal();
                    return returnval;
                }
            },
            plus: function (obj){
                return function(){
                    var cartInfo = cart.addToCart(obj);
                    if (!cartInfo.success) {
                        alert("can't sell you more or you'll get addicted!");
                        return;
                    }
                    composed.resetTotal();
                    return cartInfo.qty.toString();
                }
            }
        };

        function createRow(obj){
            var cells = createCells(obj);
            return domMainTblHelper.createRow(cells, utils.getCtorName(obj));
        }

        function appendHeader(placeholder) {
            return domMainTblHelper.insertChildToParent(placeholder, headersRow);
        }

        function createCells(obj) {
            var result = [];
            for(var i = 0; i<headers.length; i++){
                var key = headers[i];
                var cell = null;
                switch(key){
                    case 'cart':
                        cell = createCartPlusMinusCell(obj);
                        break;
                    case 'price':
                        cell = domMainTblHelper.createCell('$'+obj.getPrice(), key);
                        break;
                    default:
                        cell = domMainTblHelper.createCell(obj[key], key);
                }
                result.push(cell);

            }
            return result;
        }

        function createCartPlusMinusCell(obj){
            var cartItem = cart.getItemInChart(obj.id);

            var labelQty = domMainTblHelper.createCartLabel(cartItem ? cartItem.qty : 0);
            var plusButton = domMainTblHelper.createCartAddRemoveButton(cartEvent.plus(obj), labelQty, '+');
            var minusButton = domMainTblHelper.createCartAddRemoveButton(cartEvent.minus(obj), labelQty, '-');
            return domMainTblHelper.createCartCell(plusButton, minusButton, labelQty);
        }

        function appendTblBody(placeholder, iterator) {
            while (iterator.hasNext()) {
                domMainTblHelper.insertChildToParent(
                    placeholder,
                    createRow(iterator.next())
                );
            }
            return placeholder;
        }

        function reset(iterator) {
            var placeholder = domMainTblHelper.getDetachedPlaceholder();
            appendHeader(placeholder);
            appendTblBody(placeholder, iterator);
            domMainTblHelper.reset(placeholder);
        }

        function init(iterator){
            reset(iterator);
        }

        return {
            reset: reset,
            init: init
        }
    }
);