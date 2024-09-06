import AuthHeader from "../utils/AuthHeader";

export const signupUser = async (user) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const url = `${baseUrl}/user/add`;

  console.log(`user from api : ${url}`);

  const signUpObj = {
    username: user.username,
    email: user.email,
    hashed_password: user.hashed_password,
    phone_number: user.phone_number,
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
        message: `${errorData.detail}!!!`,
      };
    }

    return response.json();
  } catch (error) {
    // console.error("Error during signup:", error);
    return null;
  }
};
