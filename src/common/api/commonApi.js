const getAuthorization = () => {

    return `Bearer ${ sessionStorage.getItem("loginUser") }`;
};
// > 매번 요청 시점에서 sessionStorage 로 부터 데이터를 꺼내올 수 있도록 함수 형태로

export { getAuthorization };