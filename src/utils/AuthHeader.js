export default function AuthHeader() {

    const userData = localStorage.getItem('token');

    if (userData) {
        return {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + userData
        };

    } else {
        return {
            'Content-Type': 'application/json'
        };
    }
}