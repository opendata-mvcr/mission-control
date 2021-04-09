import React from "react";
import { Typography, Box } from "@material-ui/core";

import t, { Namespace } from "components/i18n";
import VocabulariesTable from "./VocabulariesTable";
import AddVocabulary from "./AddVocabulary";

const WorkspaceVocabularies: React.FC = () => (
  <Namespace.Provider value="vocabularies">
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Typography variant="h5" paragraph>
        {t`vocabularies`}
      </Typography>
      <AddVocabulary />
    </Box>
    <VocabulariesTable />
  </Namespace.Provider>
);

export default WorkspaceVocabularies;
