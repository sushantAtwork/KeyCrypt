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
      method: "POST",
      headers: AuthHeader(),
      body: JSON.stringify(signUpObj),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        message: `${errorData.detail}!!!`
      };
    }

    return response.json();
    
  } catch (error) {
    console.error("Error during signup:", error);
    return null;
  }
};
