import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import FAQ from "./scenes/faq";
import Accounts from "./scenes/accounts";
import Opportunities from "./scenes/opportunities";
import Leads from "./scenes/leads";
import Users from "./scenes/users";
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
import AppNavbar from "./scenes/global/AppNavbar";
import TestForm from "./scenes/formik/TestForm";
import AccountDetailPage from "./scenes/recordDetailPage/AccountDetailPage";
import ContactDetailPage from "./scenes/recordDetailPage/ContactDetailPage";
import LeadDetailPage from "./scenes/recordDetailPage/LeadDetailPage";
import OpportunityDetailPage from "./scenes/recordDetailPage/OpportunityDetailPage";
import NewForm from "./scenes/form";
import UserForm from "./scenes/formik/UserForm";
import UserDetailPage from "./scenes/recordDetailPage/UserDetailPage";
import InventoryForm from "./scenes/formik/InventoryForm";
import Inventories from "./scenes/inventories";
import InventoryDetailPage from "./scenes/recordDetailPage/InventoryDetailPage";
import EventForm from "./scenes/formik/EventForm";
import ComboBox from "./scenes/formik/lookup";
import SimpleAccordion from "./scenes/recordDetailPage/TestAccordion";

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
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            <Routes>
              <Route path="/" element={< Accounts/>} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/inventories" element={<Inventories/>} />
              <Route path="/users" element={<Users />} />
              <Route path="/new-accounts" element={<AccountForm />} />
              <Route path="/new-contacts" element={<ContactForm />} />
              <Route path="/new-opportunities" element={<OpportunityForm />} />
              <Route path="/new-leads" element={<LeadForm />} />
              <Route path="/new-users" element={<UserForm/>} />
              <Route path="/new-inventories" element={<InventoryForm/>}/>
              <Route path="/new-event" element={<EventForm/>}/>
              <Route path="/form" element={<NewForm />} />
              <Route path="/team" element={<Team />} />
              <Route path="/faq" element={<FAQ />} />
              
              <Route path="/test1" element={<ComboBox/>} />
              <Route path="/test" element={<SimpleAccordion/>} />
              <Route path="/accountDetailPage" element={<AccountDetailPage/>} />
              <Route path="/contactDetailPage" element={<ContactDetailPage/>} />
              <Route path="/opportunityDetailPage" element={<OpportunityDetailPage/>}/>
              <Route path="/leadDetailPage" element={<LeadDetailPage/>} />
              <Route path="/inventoryDetailPage" element={<InventoryDetailPage/>}/>
              <Route path="/userDetailPage" element={<UserDetailPage/>} />
              <Route path="/test-date" element={<MaterialUIPickers/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
     </ColorModeContext.Provider>
  );
}

export default App;
