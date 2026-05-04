import prisma from "@/libs/prisma";
import _ from "lodash";
import branch from "./branch.json";
import subBranch from "./sub-branch.json";

export default async function seedBranch() {
  await prisma.$transaction(async (tx) => {
    const exists = await tx.branch.findFirst({ select: { id: true } });

    if (exists) return;
    console.log("Seeding Branch...");

    await tx.branch.createMany({ data: branch });
  });

  await prisma.$transaction(async (tx) => {
    const exists = await tx.subBranch.findFirst({ select: { id: true } });

    if (exists) return;
    console.log("Seeding Sub Branch...");

    await tx.subBranch.createMany({
      data: _.flatten(
        _.map(subBranch, ({ branchId, branches }) =>
          _.map(branches, (branch) => ({ ...branch, branchId })),
        ),
      ),
    });
  });
}
