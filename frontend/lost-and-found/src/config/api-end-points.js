const { REACT_APP_ENV} = process.env;
export const API_URL = REACT_APP_ENV === 'production' ? 'http://172.17.0.80:1701' : REACT_APP_ENV === 'development' ? 'http://172.17.0.80:8080' : REACT_APP_ENV === 'temp' ? 'http://172.17.0.80:8001' : 'http://localhost:8080' ;

