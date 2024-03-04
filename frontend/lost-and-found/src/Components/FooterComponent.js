import Footer from "react-footer-comp";

const FooterComponent = () => {
    
    return (<Footer
        copyrightIcon
        height={150}
        bgColor={"#333"}
        copyrightText
        copyrightIconStyle={{
            color: "grey",
            fontSize: 20,
            marginRight: 10,
            alignSelf: "center"
        }}
        copyrightTextStyle={{
            color: "grey",
            fontSize: 20,
            marginRight: 10,
            alignSelf: "center"
        }}
        textStyle={{
            color: "white",
            fontSize: 16,
            marginRight: 10,
            alignSelf: "center"
        }}
        text={"All rights reserved."}
    ></Footer>);
}
export default FooterComponent;