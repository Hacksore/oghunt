import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "jsx-email";
import { Footer } from "../components/footer";

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "64px",
  padding: "20px 0 48px",
};

const box = {
  padding: "0 48px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#4F46E5",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "12px",
  marginBottom: "12px",
  padding: "8px 6px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const header = {
  fontWeight: "bold",
};

const baseUrl = import.meta.isJsxEmailPreview ? "/assets" : "https://assets.oghunt.com";

export const Template = () => (
  <Html>
    <Head />
    <Preview>Welcome to OGHUNT - You're subscribed to our daily emails!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Section style={header}>
            <Img src={`${baseUrl}/icon-64.png`} alt="OGHUNT Logo" width="64" height="64" />
            <Text style={paragraph}>OGHUNT</Text>
          </Section>
          <Text style={paragraph}>
            Thanks for subscribing to OGHUNT's daily emails! We're excited to have you join our
            community and can't wait to share our daily updates with you.
          </Text>
          <Text style={paragraph}>
            You'll receive our latest updates and insights every day. In the meantime, you can check
            out our website to find more cool products.
          </Text>
          <Button align={"center"} style={button} href="https://oghunt.com" target="_blank" height={48} width={200}>
            Visit OGHUNT
          </Button>
          <Footer />
        </Section>
      </Container>
    </Body>
  </Html>
);
