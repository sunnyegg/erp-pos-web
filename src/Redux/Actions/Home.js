import Axios from "axios";
import ls from "local-storage";

export const getHome = options => {
  return {
    type: "GET_HOME",
    payload: new Promise((resolve, reject) => {
      const { search = "", sort = "", page = "1", order = "" } = options;

      Axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/products?sort=${sort}&order=${order}&search=${search}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${ls.get("token")}`
          }
        }
      )
        .then(result => resolve(result))
        .catch(error => reject(error));
    })
  };
};
