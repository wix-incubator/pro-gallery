We now support two different products with two different open source versions: 
TPA: V4
Native: V5

In order to release a hot fix to TPA:
1. `git checkout V4_Final`
2. `git checkout -b V4_FINAL_MY_COOL_HOTFIX`
3. write your code
4. `git push origin -u V4_FINAL_MY_COOL_HOTFIX`
5. Create a pull request using GitHub, and *SET THE BRANCH THE BASE BRANCH TO V4_FINAL*
6. Wait for tests to pass
7. Merge to V4_FINAL


After merge to V4_FINAL
1. V4 branch will deploy a new patch upon successfull build
2. Once V4_FINAL has a successfull build, you will see the new version as a seperate commit
3. Use loki/other tools to update the TPA with the new version

