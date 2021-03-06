import React, {
  MouseEvent,
  SuspenseConfig,
  unstable_useTransition as useTransition,
} from "react";
import { useRouter } from "react-router5";
import { useAuth } from "@opendata-mvcr/assembly-line-shared";

import { Workspace } from "@types";
import Routes from "app/routes";

import t from "components/i18n";
import { DataColumn, DataTableSuspense } from "components/DataTable";
import UserChip from "components/users/UserChip";
import Tools from "./Tools";
import formatDate from "utils/formatDate";

import { workspacesResource, fetchWorkspace } from "data/workspaces";

type WorkspacesTableProps = {
  currentUserOnly?: boolean;
};

const WorkspacesTable: React.FC<WorkspacesTableProps> = ({
  currentUserOnly = false,
}) => {
  const router = useRouter();
  const [startTransition] = useTransition({
    timeoutMs: 10000,
  } as SuspenseConfig);

  const {
    user: {
      profile: { sub },
    },
  } = useAuth();

  const columns: DataColumn<Workspace>[] = [
    {
      title: t`label`,
      field: "label",
    },
    {
      title: t`owner`,
      render: ({ author }) => <UserChip {...author} />,
    },
    {
      title: t`lastEditor`,
      render: ({ lastEditor }) => lastEditor && <UserChip {...lastEditor} />,
    },
    {
      title: t`lastModified`,
      render: ({ lastModified }) => lastModified && formatDate(lastModified),
    },
    {
      title: t`actions`,
      render: ({ uri }) => <Tools workspaceUri={uri} />,
    },
  ];

  if (currentUserOnly) {
    columns.splice(1, 1);
  }

  const onRowClick = (
    _: MouseEvent | undefined,
    rowData: Workspace | undefined
  ) => {
    if (rowData) {
      startTransition(() => {
        fetchWorkspace(rowData.id);
        rowData && router.navigate(Routes.Workspace, { id: rowData.id });
      });
    }
  };

  const dataFilter = (data: any[]) =>
    data.filter((workspace) => (workspace as Workspace).author.id === sub);

  return (
    <DataTableSuspense
      columns={columns}
      resource={workspacesResource}
      filter={currentUserOnly ? dataFilter : undefined}
      onRowClick={onRowClick}
    />
  );
};

export default WorkspacesTable;
