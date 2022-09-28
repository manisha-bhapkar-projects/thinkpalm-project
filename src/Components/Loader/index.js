import { Spinner } from "react-bootstrap";

export default function Loader(props) {
    return (
        <div
            style={{
                textAlign: "center",
                marginTop: 20,
            }}
            data-test='loader'
            className="custom-loader-component"
        >
            <Spinner animation="grow" {...props} />
        </div>
    )
}