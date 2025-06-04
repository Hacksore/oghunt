import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "jsx-email";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Button } from "../components/button";

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

const baseUrl = import.meta.isJsxEmailPreview ? "/assets" : "https://assets.oghunt.com";

export const Template = () => (
  <Html>
    <Head />
    <Preview>Welcome to oghunt - You're subscribed to our daily emails!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Header baseUrl={baseUrl} />
          <Text style={paragraph}>
            Thanks for subscribing to oghunt's daily emails! We're excited to have you join our
            community and can't wait to share our daily updates with you.
          </Text>
          <Text style={paragraph}>
            You'll receive our latest updates and insights every day. In the meantime, you can check
            out our website to find more cool products.
          </Text>
          <Button href="https://oghunt.com">Visit oghunt</Button>
          <Footer />
        </Section>
      </Container>
    </Body>
  </Html>
);
