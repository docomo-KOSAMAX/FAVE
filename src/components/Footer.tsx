import React, { useState } from "react";
import { Button, AppBar, Box, Dialog, DialogContent } from "@mui/material";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Post from "./Post"; // Postコンポーネントをインポート

export const Footer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState<boolean>(false);

  // URLからユーザー名を取得
  const userName = searchParams.get("name");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePage = () => {
    window.location.reload();
  };

  return (
    <Box
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "row",
        gap: "8px",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          background: "linear-gradient(135deg, #6C63FF 0%, #48A9FE 100%)",
          color: "#FFFFFF",
          fontWeight: "bold",
          borderRadius: "24px",
          padding: "10px 24px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          outline: "none", // 黒い枠を防ぐ
          "&:focus": {
            outline: "none", // フォーカス時も黒い枠を防ぐ
          },
          "&:hover": {
            background: "linear-gradient(135deg, #5A55E0 0%, #3C99DC 100%)",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        投稿する
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        <DialogContent>
          <Post onClose={handleClose} />
        </DialogContent>
      </Dialog>
      <Button
        variant="contained"
        color="secondary"
        onClick={updatePage}
        sx={{
          backgroundColor: "#FF4081",
          color: "#FFFFFF",
          fontWeight: "bold",
          borderRadius: "24px",
          padding: "10px 24px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          outline: "none", // 黒い枠を防ぐ
          "&:focus": {
            outline: "none", // フォーカス時も黒い枠を防ぐ
          },
          "&:hover": {
            backgroundColor: "#F50057",
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        更新する
      </Button>
    </Box>
  );
};
