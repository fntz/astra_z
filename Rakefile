require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'yaml'

Bundler.require

#Helper module for colorize output
module Colorize 
  extend self

  def red(msg)
    "\e[31m#{msg}\e[0m\n"
  end

  def green(msg)
    "\e[32m#{msg}\e[0m\n"
  end

  def yellow(msg)
    "\e[33m#{msg}\e[0m\n"
  end  
end

logger = Logger.new(STDOUT)
logger.formatter = Proc.new do  |severity, time, progname, msg|
  Colorize.green(msg)
end


ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = logger
BUNDLES     = ["astra_z.js"]
BUILD_DIR   = ROOT.join(".")
SOURCE_DIR  = ROOT.join("src")
SOURCE_FILE = "astra_z.js"
OUTPUT       = BUILD_DIR.join(SOURCE_FILE)
BROWSERS = ["opera", "chromium-browser", "firefox"]
TEST_PATH = ROOT.join("test/SpecRunner.html")
VERSION_FILE = "version.yaml"
VERSION = YAML.load_file("#{SOURCE_DIR}/#{VERSION_FILE}")['ASTRA_Z_VERSION'] 

desc "Join files into one source"
task :compile do
  FileUtils.rm OUTPUT if File.exist?(OUTPUT)

  sprockets = Sprockets::Environment.new(ROOT) do |env|
    env.logger = LOGGER
  end

  sprockets.append_path(SOURCE_DIR.join('javascript').to_s)
  
  BUNDLES.each do |bundle|
    assets = sprockets.find_asset(bundle)
    assets.write_to(OUTPUT)
  end
end

desc "Run test in browser passed in arguments."
#
# rake test opera
#
task :test do  
  browser = ARGV[1] || "firefox"
  
  puts Colorize.green"Run test with `#{browser}` browser"
  puts Colorize.yellow(
    "Warning! #{browser} not found in known browsers #{BROWSERS}"
  ) unless BROWSERS.include?(browser)

  `#{browser} #{TEST_PATH}`

  task browser.to_sym do ; end
end 



