const utils = require("./utils");
const core = require("@actions/core");

async function deleteByTag(config, octokit) {
  core.info(`🔎 search package version with tag ${config.tag}...`);

  const packageVersions = await utils.findPackageVersionByTag(
    octokit,
    config.owner,
    config.name,
    config.tag
  );

  for (let packageVersion of packageVersions) {

    core.info(`🆔 package id: [${packageVersion.id}], tag: [${packageVersion.tag}], updatedAt: [${packageVersion.updatedAt}], delete it...`);

  // await utils.deletePackageVersion(
  //   octokit,
  //   config.owner,
  //   config.name,
  //   packageVersion.id
  // );

  // core.info(`✅ package #${packageVersion.id} deleted.`);
  }
}

async function deleteUntaggedOrderGreaterThan(config, octokit) {
  core.info(`🔎 find not latest ${config.untaggedKeepLatest} packages...`);

  const pkgs = await utils.findPackageVersionsUntaggedOrderGreaterThan(
    octokit,
    config.owner,
    config.name,
    config.untaggedKeepLatest
  );

  core.startGroup(`🗑 delete ${pkgs.length} packages`);

  for (const pkg of pkgs) {
    await utils.deletePackageVersion(
      octokit,
      config.owner,
      config.name,
      pkg.id
    );

    core.info(`✅ package #${pkg.id} deleted.`);
  }

  core.endGroup();
}

module.exports = { deleteByTag, deleteUntaggedOrderGreaterThan };
