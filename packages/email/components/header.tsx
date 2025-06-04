import { Section, Text, Img } from "jsx-email";


const header = {
  fontWeight: "bold",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

export const Header = ({ baseUrl }: { baseUrl: string }) => {
  return (
    <Section style={header}>
      <Img src={`${baseUrl}/icon-64.png`} alt="oghunt Logo" width="64" height="64" />
      <Text style={paragraph}>oghunt</Text>
    </Section>
  );
};