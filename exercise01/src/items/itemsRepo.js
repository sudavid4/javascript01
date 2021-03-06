define(
    [],
    function () {
        'use strict';
        var items = null;

        function getItemsCount() {
            return items.length;
        }

        function getIterator(startIdx, maxSequenceSize) {
            var currIdx, endIdx;

            if (!startIdx && !maxSequenceSize) {
                startIdx = 0;
                maxSequenceSize = getItemsCount();
            }

            function iteratorInit() {
                if (startIdx >= items.length) {
                    throw new RangeError("can't start iteration after last item");
                }
                if (startIdx < 0 || maxSequenceSize <= 0) {
                    throw new RangeError(
                        'startId = ' + startIdx + 'sequenceSize = ' + maxSequenceSize +
                        '. They must both be positive'
                    );
                }
                currIdx = startIdx;
                endIdx = startIdx + maxSequenceSize - 1;
                if (endIdx >= items.length - 1) {
                    endIdx = items.length - 1;
                }
            }

            function hasNext() {
                return currIdx <= endIdx;
            }

            function next() {
                if (!hasNext()) {
                    throw new RangeError('iterator passed last');
                }
                return items[currIdx++];
            }


            iteratorInit();
            return {
                hasNext: hasNext,
                next: next

            };
        }

        function getItemById(id) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === id) {
                    return items[i];
                }
            }
            return null;
        }

        function init(itemsArg) {
            items = itemsArg;
        }

        return {
            getItemsCount: getItemsCount,
            getIterator: getIterator,
            getItemById: getItemById,
            init: init
        };
    }
);