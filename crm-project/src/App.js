import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import UserForm from "./scenes/form";
import FAQ from "./scenes/faq";
import Accounts from "./scenes/accounts";
import Opportunities from "./scenes/opportunities";
import Leads from "./scenes/leads";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import HomePage from "./scenes/home";
import DependentPicklist from "./scenes/formik/dependentPicklist";
import AccountForm from "./scenes/formik/AccountForm";
import ContactForm from "./scenes/formik/ContactForm";
import OpportunityForm from "./scenes/formik/OpportunityForm";
import LeadForm from "./scenes/formik/LeadForm";
import MaterialUIPickers from "./scenes/formik/datePick";
import FormikDepend from "./scenes/formik/formikDepend";
import LookupOption from "./scenes/formik/lookup";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={< HomePage/>} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/team" element={<Team />} />
              <Route path="/new-accounts" element={<AccountForm />} />
              <Route path="/new-contacts" element={<ContactForm />} />
              <Route path="/new-opportunities" element={<OpportunityForm />} />
              <Route path="/new-leads" element={<LeadForm />} />
              <Route path="/form" element={<UserForm />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/test" element={<DependentPicklist/>} />

              <Route path="/test-date" element={<MaterialUIPickers/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
     </ColorModeContext.Provider>
  );
}

export default App;
