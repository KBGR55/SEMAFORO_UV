class token {
    constructor() {
        this.token = null;
        this.external = null;
        this.tokenApi = null;
           
    }
    settokenApi(tokenAp) {
        this.tokenApi = tokenAp;
    }

    gettokenApi() {
        return this.tokenApi;
    }
    setExternal(external) {
        this.external = external;
    }

    getExternal() {
        return this.external;
    }
    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }
}

module.exports = new token();