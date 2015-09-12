'use strict';

exports = module.exports = function(params) {
	
	var mongoose = params.mongoose;
	var approvalStepSchema = new mongoose.Schema({

        status: { type: String, enum: [ null, 'waiting', 'accepted', 'rejected' ], default: null },
    
        department: String,                                                // department name used to create this approval step
		approvers: [mongoose.Schema.Types.ObjectId],			           // list of users
                                                                           // user model is not specified because this schema is embeded into
                                                                           // the request model, linked to user model
 		operator: { type: String, enum: ['OR', 'AND'], required: true }    // approvers operator for step validation
	});



    /**
     * Test if a user is in the approvers list
     * @param {String|User} user
     * @return {Boolean}
     */
    approvalStepSchema.methods.isApprover = function(user) {

        var approverId;
        var userId = user;
        if (undefined !== user._id) {
            userId = user._id;
        }

        for(var i=0; i<this.approvers.length; i++) {
            approverId = this.approvers[i];
            if (undefined !== approverId._id) {
                approverId = approverId._id.toString();
            }

            if (approverId.equals(userId)) {
                return true;
            }
        }

        return false;
    };


    /**
     * Get displayable status
     * @return {string}
     */
    approvalStepSchema.methods.getDispStatus = function() {
        var Gettext = require('node-gettext');
        var gt = new Gettext();

        switch(this.status) {
            case 'waiting':     return gt.gettext('Waiting');
            case 'accepted':    return gt.gettext('Waiting');
            case 'rejected':    return gt.gettext('Rejected');
        }

        return null;
    };
  


	approvalStepSchema.set('autoIndex', params.autoIndex);

    params.embeddedSchemas.ApprovalStep = approvalStepSchema;
};
