import { User } from 'radiks'

class VriendUser extends User {
    static className = 'VriendUser'

    static schema = {
        ...User.schema,
        description: { type: String, decrypted: true },
        username: { type: String, decrypted: true },
        image_url: { type: String, decrypted: true },
        display_name: { type: String, decrypted: true },
        background_img: { type: String, decrypted: true },
        location: { type: String, decrypted: true },
    }

    static findByUsername(username, options = { decrypt: true }) {
        return this.findOne({ username, options });
    }

}

export default VriendUser