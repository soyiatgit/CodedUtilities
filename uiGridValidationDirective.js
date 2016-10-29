
/*
This directive was coded to provide validations in the ui-grid
This uses ui-grid EVENT_START and EVENT_STOP events to initiate and
eleminate the directive

Date of Draft : 28-10-2016
Author: Saurabh Tiwari
*/
(function(module){
	
    module.directive('ppGridValidation', ppGridValidationFn);

    ppGridValidationFn.$inject = ['uiGridEditConstants'];

    function ppGridValidationFn(uiGridEditConstants) {
        var directive = {
            restrict: 'A',
            template: '<div><input type="text" ng-model="txtValue"  ng-change="changeTxt(txtValue)"/></div>',
            scope: true,
            link: ppGridValidationLinkFn
        };

        return directive;

        function ppGridValidationLinkFn(scope, elm, attr) {

            var oldTxt = scope.row.entity[scope.col.field];
            scope.limit = attr.limit;
            scope.txtValue = oldTxt;

            function windowClickListener(ev) {
                if (ev.target.nodeName !== "INPUT")
                    scope.editDone();
            }

            scope.changeTxt = function (val) {
                if (attr.words) {
                    if (scope.txtValue && scope.txtValue.match(/\S+/g) && scope.txtValue.match(/\S+/g).length > Number(scope.limit)) {
                        scope.txtValue = scope.txtValue.split(/\s+/, Number(scope.limit)).join(" ");
                        scope.row.entity[scope.col.field] = scope.txtValue.split(/\s+/, Number(scope.limit)).join(" ");
                    }
                    else
                        scope.row.entity[scope.col.field] = scope.txtValue;
                }
                else {
                    if (scope.txtValue && scope.txtValue.length > Number(scope.limit)) {
                        scope.txtValue = scope.txtValue.slice(0, Number(scope.limit));
                        scope.row.entity[scope.col.field] = scope.txtValue;
                    }
                    else
                        scope.row.entity[scope.col.field] = scope.txtValue;
                }
            };

            scope.editDone = function () {
                scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
            };

            scope.$on(uiGridEditConstants.events.BEGIN_CELL_EDIT, function () {
                angular.element(window).on('click', windowClickListener);
            });

            scope.$on('$destroy', function () {
                angular.element(window).off('click', windowClickListener);
            });
        }
    
    }
}(angular.module("ModuleName"))); 
