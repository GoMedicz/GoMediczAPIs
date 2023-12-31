class Utils{
    constructor(){
        this.messages = {
            IMAGE_UPLOAD_ERROR: "Please check your file(s) and try again",
            DATA_ERROR: "Some fields are empty",
            UPDATE_DATA_ERROR: "You need to send over the required data",
            UPDATE_AFTER_VERIFICATION_ERROR:
                "Cannot update name after verification",
            URL_ERROR: "That URL is invalid",
            DUPLICATE_ERROR: "Data provided is already in use",
            EMAIL_DUPLICATE_ERROR: "Email provided is already in use",
            USERNAME_DUPLICATE_ERROR: "Username provided is already in use",
            PHONE_NUMBER_DUPLICATE_ERROR:
                "Phone number provided is already in use",
            USAGE_ERROR: "That slug is already in use",
            ACCOUNT_EXISTENCE_ERROR: "No account associated with that data",
            ACCOUNT_EXISTS_ERROR: "account exists already",
            EXISTENCE_ERROR: "We couldn't find what you requested",
            AUTHORIZATION_ERROR: "You aren't authorized for that action",
            VALIDATION_ERROR: "please provide valid credentials",
            UNKNOWN_ERROR: "Something completely went wrong",
            PASSWORD_MATCH_ERROR: "Your password doesn't match our records",
            CONFIRM_PASSWORD_ERROR: "passwords dont match",
            DATA_VALIDATION_ERROR: "Invalid characters in data sent",
            INCOMPLETE_DATA_ERROR:"please provide requested credentials",
            BAD_DATA_ERROR: "You've got some errors in your sent data",
            BAD_DATA_ERROR: "You've got some errors in your sent data",
            INTEREST_DATA_ERROR:
                "You've got some errors in the interests data sent",
            LOGIN_SUCCESS: "Sign In successful",
            LOGIN_FAILURE: "Sign In unsuccessful",
            ACCOUNT_UPDATE_SUCCESS: "Account has been successfully updated",
            LOGOUT_SUCCESS: "Sign Out successful",
            ITEM_CREATE_ERROR:'unable to create new items',
            LOGOUT_ERROR:"We had issues logging you out, try again",
            REGISTER_SUCCESS: "Your account has been successfully created",
            REGISTER_FAILURE: "unable to register user",
            INVALID_TOKEN_ERROR: "Invalid authentication token provided",
            TOKEN_ERROR: "Authentication token required",
            UPDATE_ERROR: "You are not allowed to make that update",
            DOB_ERROR: "The DOB data sent contains invalid data objects",
            PASSWORD_STRENGTH_ERROR: "Your password isn't strong enough",
            PASSWORD_RECOVERY_INITIATED:
                "A recovery OTP has been sent to your email address",
            PASSWORD_RECOVERY_SUCCESS:
                "Your password has been successfully recovered",
            OTP_ERROR: "Invalid or expired OTP provided",
            QUERY_SUCCESS: "Request data successfully queried",
            REQUEST_SUCCESS: "Your request was successfully executed",
            INTERNAL_SERVER_ERROR:"Server error"

    };


}
getMessage(message){
        return this.messages[message] || message.toLowerCase();
    }
}

module.exports = {
    Utils
}