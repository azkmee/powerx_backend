class User {
    constructor({ id, username, password_hash, email }){
        this.id = id
        this.username = username
        this.password_hash = password_hash
        this.email = email
    }
}

module.exports = User