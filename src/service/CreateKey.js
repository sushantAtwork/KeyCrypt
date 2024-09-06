import AuthHeader from "../utils/AuthHeader";

export const createKey = async (keyData) => {

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const url = `${baseUrl}/user/add/key/`;

    const keyObj = {
        key: keyData.key_name,
        value: keyData.key_value,
        type: keyData.key_type
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: AuthHeader(),
            body: JSON.stringify(keyObj)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                message: `${errorData.detail}!!!`
            };
        }

        return response.json();

    } catch (error) {
        // console.error('Error during signup:', error);
        return null;
    }
};
