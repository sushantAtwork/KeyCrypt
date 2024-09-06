import AuthHeader from "../utils/AuthHeader";

export const deleteKey = async (keyId) => {

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const url = `${baseUrl}/user/delete/key/${keyId}`;


    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: AuthHeader()
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                message: `${errorData.detail}!!!`
            };
        }

        return response.json();

    } catch (error) {
        console.error('Error during signup:', error);
        return null;
    }
};
