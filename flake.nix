{
  description = "Mokuroku - Speaking schedule website";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      packages = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in
        {
          chrome-devtools-mcp = pkgs.writeShellScriptBin "chrome-devtools-mcp" ''
            exec ${pkgs.pnpm}/bin/pnpm dlx chrome-devtools-mcp@latest -e ${pkgs.google-chrome}/bin/google-chrome-stable "$@"
          '';
        }
      );

      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs; [
              nodejs_24
              pnpm
              lefthook
            ];
          };
        }
      );
    };
}
