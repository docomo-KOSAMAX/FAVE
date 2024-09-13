import React from "react";
import { Button, AppBar, Box } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
//   children?: React.ReactElement<any>;
// }

// function HideOnScroll(props: Props) {
//   const { children, window } = props;
//   // Note that you normally won't need to set the window ref as useScrollTrigger
//   // will default to window.
//   // This is only being set here because the demo is in an iframe.
//   const trigger = useScrollTrigger({
//     target: window ? window() : undefined,
//   });

//   return (
//     <Slide appear={false} direction="down" in={!trigger}>
//       {children ?? <div />}
//     </Slide>
//   );
// }

export const Header = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URLからユーザー名を取得
  const userName = searchParams.get("name");
  const pathname = useLocation().pathname;

  const isTimeline = pathname === `/` && true;
  const isUserPage = pathname === `/user/` && true;
  const MoveToTimeline = () => {
    // console.log("timeline");
    navigate(`/?name=${userName}`);
  };

  const MoveToUserPage = () => {
    // console.log("User");
    navigate(`/user/?name=${userName}`);
  };
  return (
    // <HideOnScroll {...props}>
    <AppBar
      position="sticky"
      sx={{
        background: "#EEEEEE",
        // backgroundColor: "transparent",
        borderRadius: "15px",
      }}
    >
      {/* <Box sx={{ textAlign: "center", background: "white", color: "blue" }}>
        タイムライン
      </Box> */}
      <Box
        sx={{
          flexDirection: "row",
          height: "80px",
          background: "#EEEEEE",
          // background: "white",
          backgroundColor: "transparent",
          // fontFamily: "fantasy",
          boxShadow: "0",
          // borderRadius: "15px",
        }}
      >
        <Button
          sx={{
            fontSize: 30,
            fontFamily: "inherit",
            fontWeight: 900,
            width: "50%",
            height: "100%",
            backgroundColor: "#EEEEEE",
            color: "#9966FF",
            // borderBlockColor: "red",
            // borderRadius: "15px",
            borderBottom: isTimeline ? 5 : 0,
          }}
          onClick={MoveToTimeline}
        >
          タイムライン
        </Button>
        <Button
          sx={{
            fontSize: 30,
            fontFamily: "inherit",
            fontWeight: 900,
            height: "100%",
            width: "50%",
            backgroundColor: "#EEEEEE",
            color: "#9966FF",
            // borderRadius: "15px",
            borderBottom: isUserPage ? 5 : 0,
          }}
          onClick={MoveToUserPage}
        >
          ユーザー
        </Button>
      </Box>
    </AppBar>
    // </HideOnScroll>
  );
};
