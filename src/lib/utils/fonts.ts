import {
  Poppins as PoppinsFont,
  Montserrat_Alternates,
  Montserrat,
} from "next/font/google";


export const Poppins = PoppinsFont({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const MontserratAlternates = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
