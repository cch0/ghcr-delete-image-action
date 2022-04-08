const utils = require("./utils");
const core = require("@actions/core");


async function deleteByTag(config, octokit) {
  core.info(`🔎 search package version with tag ${config.tag}...`);

  const packageVersion = await utils.findPackageVersionByTag(
    octokit,
    config.owner,
    config.name,
    config.tag
  );

  core.info(`🆔 package id is #${packageVersion.id}, delete it...`);

  await utils.deletePackageVersion(
    octokit,
    config.owner,
    config.name,
    packageVersion.id
  );

  core.info(`✅ package #${packageVersion.id} deleted.`);
}

async function deleteByTagPatternAndTTL(config, octokit) {
  core.info(`🔎 search package version with pattern [${config.tagPattern}] and is older than [${config.ttlInDays}] days ...`);

  const packageVersions = await utils.findPackageVersionByTagPatternAndTTL(
    octokit,
    config.owner,
    config.name,
    config.tagPattern,
    config.ttlInDays
  );

  for (let packageVersion of packageVersions) {

    core.info(`🆔 package id: [${packageVersion.id}], tag: [${packageVersion.tag}], updatedAt: [${packageVersion.updatedAt}], daysOld: [${packageVersion.daysOld}], delete it...`);

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
