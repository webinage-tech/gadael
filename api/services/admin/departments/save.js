'use strict';



/**
 * Validate params fields
 * @param {apiService} service
 * @param {Object} params
 */
function validate(service, params) {

    if (service.needRequiredFields(params, ['name'])) {
        return;
    }

    saveDepartment(service, params);
}
    
    
/**
 * Update/create the department document
 * 
 * @param {apiService} service
 * @param {Object} params
 */  
function saveDepartment(service, params) {
    
    var DepartmentModel = service.models.Department;
    
    var fieldsToSet = { 
        name: params.name,
        nonWorkingDays: params.nonWorkingDays
    };

    if (params.id)
    {
        DepartmentModel.findByIdAndUpdate(params.id, fieldsToSet, function(err, document) {
            if (service.handleMongoError(err))
            {
                service.resolveSuccess(
                    document, 
                    service.gt.gettext('The department has been modified')
                );
            }
        });

    } else {

        DepartmentModel.create(fieldsToSet, function(err, document) {

            if (service.handleMongoError(err))
            {
                service.resolveSuccess(
                    document, 
                    service.gt.gettext('The department has been created')
                );
            }
        });
    }
}
    
    

    
    
    
    



/**
 * Construct the department save service
 * @param   {object}          services list of base classes from apiService
 * @param   {express|object}  app      express or headless app
 * @returns {saveItemService}
 */
exports = module.exports = function(services, app) {
    
    var service = new services.save(app);
    
    /**
     * Call the department save service
     * 
     * @param {Object} params
     *
     * @return {Promise}
     */
    service.call = function(params) {
        validate(service, params);
        return service.deferred.promise;
    };
    
    
    return service;
};


