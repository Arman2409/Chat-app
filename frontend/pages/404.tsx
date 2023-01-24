import { Typography } from "antd";

const Page404:React.FC = () => {
    return (
        <div className="error-cont">
          <Typography style={{
            color: "brown"
          }}>
             404 | Page Not Found!
          </Typography>
        </div>
    )
}

export default Page404;