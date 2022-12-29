import { Typography } from "antd";

const Page404:React.FC = () => {
    return (
        <div style={{
            width: "100%",
            height: "calc(100vh - 160px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
          <Typography style={{
            color: "brown"
          }}>
             404 | Page Not Found!
          </Typography>
        </div>
    )
}

export default Page404;