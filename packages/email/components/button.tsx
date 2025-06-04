import { Button as ButtonComponent } from "jsx-email";

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


export const Button = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <ButtonComponent href={href} target="_blank" height={32} width={120} align={"center"} style={button}>
      {children}
    </ButtonComponent>
  );
};