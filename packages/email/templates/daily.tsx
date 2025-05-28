import { Body, Column, Container, Head, Html, Img, Preview, Row, Section, Text } from "jsx-email";
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

const header = {
  fontWeight: "bold",
};

const baseUrl = import.meta.isJsxEmailPreview ? "/assets" : "https://assets.oghunt.com";

interface Product {
  name: string;
  tagLine: string;
  description: string;
}

interface TemplateProps {
  products: Product[];
}

export const previewProps: TemplateProps = {
  products: [
    { name: "test", tagLine: "ok", description: "ok cool" },
    { name: "test2", tagLine: "o k", description: "2 ok cool" },
    { name: "test3", tagLine: "ok", description: "ok cool" },
  ],
};

export const Template = ({ products = [] }: { products: Product[] }) => (
  <Html>
    <Head />
    <Preview>OGHUNT - Daily Update!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Section style={header}>
            <Img src={`${baseUrl}/icon-64.png`} alt="OGHUNT Logo" width="64" height="64" />
            <Text style={paragraph}>OGHUNT</Text>
          </Section>
          <Text style={paragraph}>Here are the top 3 launches from yesterday!</Text>

          <Row>
            {products.map((p) => {
              return (
                <Column key={p.name}>
                  <Text>{p.name}</Text>
                  <Text>{p.description}</Text>
                </Column>
              );
            })}
          </Row>
          <Footer />
        </Section>
      </Container>
    </Body>
  </Html>
);
