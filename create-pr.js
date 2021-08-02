const { execSync } = require('child_process');

function createPullRequest(index) {
	const branchName = getBranchName()
	execSync(`git checkout -b ${branchName}`)
	execSync(`echo 'console.log("this is production code change of: ${branchName}")' >> packages/gallery/src/components/gallery/proGallery/galleryContainer.js`)
	execSync('git add .')
	execSync(`git commit -m 'dummy commit message ${index}'`)
	execSync('hub pull-request --no-edit --push --browse')
}


function getBranchName() {
	const t = new Date()
	const dateFormat = [t.getDay(), t.getMonth(), t.getFullYear(), 
		t.getHours(), t.getMinutes(), t.getSeconds()]
	return `dummy-pr-${dateFormat.join('-')}`
}

function createManyPullRequests() {
	for(let i = 0; i < 10; i++) {
		createPullRequest(i)
		execSync('git checkout many-prs')
	}
}

createManyPullRequests()
