import * as React from "react";
import { useEffect, useState } from "react";
import TransitionsModal from "../Component/Attribute/hid_attr"


import Card from "@mui/material/Card";
import {
  CardActionArea,
  Skeleton,
  Box
} from "@mui/material";

import CardContent from "@mui/material/CardContent";

// export default function MediaCard(data)
export default function MediaCard() {
  // Modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loadingDataCard, setLoadingDataCard] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4500));
      setLoadingDataCard(false);
    };
    loadData();
  }, []);

  return (
    <>
      <div id="popup" style={{ position: "absolute" }}></div>

      <div style={{ position: "absolute", right: "1rem", top: "4.25rem" }}>
        <style>
          {`
            * {
                font-family: 'Prompt', sans-serif;
                font-style: normal;
            }
          `}
        </style>
        <img id="legend" alt="legend" />
        <Card
          onClick={handleOpen}
          sx={{
            cursor: 'pointer',
            maxWidth: "355px",
            height: "100%",
            maxHeight: "180px",
            verticalAlign: "middle",
            position: "relative",
            zIndex: 10,
            borderRadius: 2.5,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardActionArea>
            <CardContent
              sx={{
                padding: "0.7rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              {loadingDataCard ? (
                <>
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    sx={{ borderRadius: 2, marginBottom: "0.75rem" }}
                    width={335}
                    height={65}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    sx={{ borderRadius: 2, marginBottom: "0.75rem" }}
                    width={335}
                    height={35}
                  />
                  <Skeleton
                    animation="wave"
                    variant="rectangular"
                    sx={{ borderRadius: 2 }}
                    width={335}
                    height={30}
                  />
                </>
              ) : (
                <>
                  <Box id="attriBute">

                    <span style={{ color: "#a6a4a4" }} id="title"></span>
                    <span
                      id="location"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    ></span>
                    <br />

                    <span id="weather"></span>
                    <span id="rainfall"></span>
                    <br />
                    <span id="rainPer"></span>
                    <span id="wind"></span>
                    <br />

                    <span
                      id="value"
                      style={{ fontWeight: "bold", fontSize: "30px" }}
                    ></span>
                    <span id="level"></span>
                    <span
                      id="update"
                      style={{
                        display: "block",
                        textAlign: "center",
                        fontWeight: 300,
                        fontSize: "11px",
                        color: "#a6a6a6",
                      }}
                    ></span>
                  </Box>
                </>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
        <TransitionsModal open={open} handleClose={handleClose} />
      </div>
    </>
  );
}

