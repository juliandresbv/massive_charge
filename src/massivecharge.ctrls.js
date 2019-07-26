(function() {
    let app = angular.module("massivecharge",['angular-js-xlsx']);

    app.controller('massivechargectrl', function($scope, $http) {
        $scope.read = function (workbook) {
            /* DO SOMETHING WITH workbook HERE */
            for (let sheetName in workbook.Sheets) {
                //console.log(sheetName);
                let jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                $scope.cleaned_jsondata = jsonData;
                console.log(jsonData);
                //console.log($scope.cleaned_jsondata);
            }
        };

        $scope.error = function (e) {
            /* DO SOMETHING WHEN ERROR IS THROWN */
            console.log(e);
        };

        getProjectId = (param_name) => {
            let url = window.location.search.substring(1);  //get rid of "?" in querystring
            let qArray = url.split('=');    //get key-value pairs
            if (qArray[0] == param_name) { return qArray[1]; }  //return value
        };

        $scope.sendDataToServer = () => {
            let project_id = parseInt( getProjectId('project_id') );
            let topost = {
                "projectId" : project_id,
                "excelData" : $scope.cleaned_jsondata
            };

            Swal.fire({
                type: 'info',
                title: 'Espera por favor',
                text: 'El archivo se cargará en breve',
                timer: 5000
            });

            $http.post('http://plantarfuturo.com/ws/api/project/xy', topost)
              .then(
                (response) => {
                    Swal.fire({
                        type: 'success',
                        title: '¡Todo listo!',
                        text: 'El archivo se ha cargado exitosamente',
                        timer: 5000
                    });

                    return response;
                },
                (err) => {
                    Swal.fire({
                        type: 'error',
                        title: 'Lo sentimos',
                        text: 'El archivo no se ha podido cargar. Por favor, inténtalo nuevamente',
                        timer: 5000
                    });

                    console.log(err);
                });

        }

    });

})();