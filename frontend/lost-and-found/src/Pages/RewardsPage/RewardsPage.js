import { Visibility, VisibilityOff } from "@mui/icons-material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { API_URL } from "../../config/api-end-points";
import { ApiRequest } from "../../helpers/api-request";
import "./RewardsPage.css";

const RewardsPage = () => {
  const [showCode, setShowCode] = useState({});
  const [activeTab, setActiveTab] = useState("all");
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [rewards, setRewards] = useState([]);

  const toggleCodeVisibility = (id) => {
    setShowCode((prevShowCode) => ({
      ...prevShowCode,
      [id]: !prevShowCode[id],
    }));
  };

  const userEmail = localStorage.getItem("user_email");
  useEffect(() => {
    ApiRequest.fetch({
      method: "get",
      url: `${API_URL}/api/v1/reward/all/${userEmail}`,
    })
      .then((response) => {
        setFilteredRewards(response);
        setRewards(response);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [userEmail]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (activeTab === "active") {
      setFilteredRewards(
        rewards.filter((item) => item.expiryDate >= currentDate)
      );
      // return reward.expiryDate >= currentDate;
    } else if (activeTab === "expired") {
      setFilteredRewards(
        rewards.filter((item) => item.expiryDate < currentDate)
      );
      // return reward.expiryDate < currentDate;
    } else {
      setFilteredRewards(rewards);
    }
  }, [activeTab, rewards]);

  const copyCodeToClipboard = (code) => {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    console.log(`Code ${code} copied to clipboard!`);
  };

  return (
    <Container className="mt-4">
      <div className="filter-buttons">
        <Button
          variant={activeTab === "all" ? "success" : "outline-success"}
          onClick={() => setActiveTab("all")}
          className="mr-2">
          All
        </Button>
        <Button
          variant={activeTab === "active" ? "success" : "outline-success"}
          onClick={() => setActiveTab("active")}
          className="mr-2">
          Active
        </Button>
        <Button
          variant={activeTab === "expired" ? "success" : "outline-success"}
          onClick={() => setActiveTab("expired")}>
          Expired
        </Button>
      </div>

      <Row className="mt-4">
        {filteredRewards?.map((reward) => (
          <Col key={reward.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className={`mb-4 reward-card ${
                reward.expiryDate < new Date().toISOString().split("T")[0]
                  ? "expired"
                  : ""
              }`}>
              <Card.Body>
                <Card.Title
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {reward.rewardData.title}
                </Card.Title>
                <Card.Text
                  style={{
                    whiteSpace: "pre-line",
                    minHeight: "3em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {reward.rewardData.description}
                </Card.Text>
                <Card.Text
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  <strong>Item:</strong> {reward.itemTitle}
                </Card.Text>
                <Card.Text>
                  <strong>Issued At:</strong>{" "}
                  {new Date(reward.issuedAt)
                    .toLocaleDateString("en-GB")
                    .split("/")
                    .reverse()
                    .slice(0, 3)
                    .join("-")}
                </Card.Text>
                <Card.Text>
                  <strong>Expiry Date:</strong>{" "}
                  <Badge bg="danger">
                    {new Date(reward.expiryDate)
                      .toLocaleDateString("en-GB")
                      .split("/")
                      .reverse()
                      .slice(0, 3)
                      .join("-")}
                  </Badge>
                </Card.Text>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="link"
                    onClick={() => copyCodeToClipboard(reward.rewardData.code)}
                    className="copy-icon-button">
                    <FileCopyIcon className="icon" />
                  </Button>
                  {showCode[reward.id] ? (
                    <span className="code-text">{reward.rewardData.code}</span>
                  ) : (
                    <span
                      className={`blurred-code ${
                        reward.expiryDate <
                        new Date().toISOString().split("T")[0]
                          ? "expired"
                          : ""
                      }`}>
                      ********
                    </span>
                  )}

                  <Button
                    variant="link"
                    onClick={() => toggleCodeVisibility(reward.id)}
                    className="code-toggle-button">
                    {showCode[reward.id] ? (
                      <VisibilityOff className="icon" />
                    ) : (
                      <Visibility className="icon" />
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RewardsPage;
