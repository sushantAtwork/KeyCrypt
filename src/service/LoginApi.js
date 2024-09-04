import AuthHeader from "../utils/AuthHeader";

export const loginUser = async (user) => {

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const url = `${baseUrl}/user/login`;

    const signUpObj = {
        email: user.email,
        password: user.password,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: AuthHeader(),
            body: JSON.stringify(signUpObj),
        });

        console.log(response)

        if (response.status === 500) {
            console.warn('Server Error!');
            return {"message" : `${response.statusText}!!!`, "status" : `${response.status}`};
        }

        if (response.status === 400){
            console.warn('Server Error!');
            return {"message" : `${response.statusText}!!!`, "status" : `${response.status}`};
        }

        if (response.status === 409){
            console.warn('Server Error!');
            return {"message" : `${response.statusText}!!!`, "status" : `${response.status}`};
        }

        return response.json();
    } catch (error) {
        console.error('Error during signup:', error);
        return null;
    }
};
